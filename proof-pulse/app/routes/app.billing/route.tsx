import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData } from "react-router";
import { authenticate } from "../../shopify.server";
import prisma from "../../db.server";
import styles from "./styles.module.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, billing } = await authenticate.admin(request);
  const { shop } = session;

  // Ensure a subscription record exists in the DB
  let subscription = await prisma.subscription.findUnique({
    where: { shop },
  });

  if (!subscription) {
    subscription = await prisma.subscription.create({
      data: { shop, plan: "Free" },
    });
  }

  // Always sync plan from Shopify's live billing data.
  // This is the source of truth — especially after the user returns
  // from the Shopify billing approval page.
  const billingCheck = await billing.check({
    isTest: true,
    plans: ["Basic", "Pro"],
  });

  // Find which paid plan is active (if any)
  const activePaidPlan = billingCheck.appSubscriptions?.find(
    (sub: { name: string }) => sub.name === "Pro" || sub.name === "Basic"
  );
  const activePlanName = activePaidPlan?.name ?? "Free";

  // Sync the DB if the plan has changed
  if (subscription.plan !== activePlanName) {
    subscription = await prisma.subscription.update({
      where: { shop },
      data: { plan: activePlanName },
    });
  }

  return {
    shop,
    plan: subscription.plan,
    isActive: billingCheck.hasActivePayment,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { billing, session } = await authenticate.admin(request);
  const { shop } = session;
  const formData = await request.formData();
  const plan = formData.get("plan") as string;

  if (plan === "Free") {
    await prisma.subscription.update({
      where: { shop },
      data: { plan: "Free" },
    });
    return { success: true };
  }

  const url = new URL(request.url);
  const returnUrl = `${url.origin}/app/billing`;

  // Request billing for Basic or Pro
  return await billing.request({
    plan: plan as any,
    isTest: true,
    returnUrl,
  });
};

export default function BillingPage() {
  const { plan, isActive } = useLoaderData<typeof loader>();

  const pricingPlans = [
    {
      name: "Free",
      description: "Get started for free.",
      price: "0.00",
      features: ["Up to 100 Monthly Visitors", "Standard Reporting"],
      isCurrent: plan === "Free",
    },
    {
      name: "Basic",
      description: "Essential tools for growing brands.",
      price: "9.99",
      features: [
        "5,000 Monthly Visitors",
        "Standard Reporting",
        "Chat Support",
      ],
      isCurrent: plan === "Basic" && isActive,
      isRecommended: false,
    },
    {
      name: "Pro",
      description: "Advanced features for high-volume stores.",
      price: "19.99",
      features: [
        "25,000 Monthly Visitors",
        "Custom Dashboards",
        "Priority Support",
        "White-labeling",
      ],
      isCurrent: plan === "Pro" && isActive,
      isRecommended: true,
    },
  ];

  return (
    <s-page heading="Plans & Billing">
      <div className={styles.container}>
        <s-section heading="Current Status" slot="primary">
          <s-paragraph>
            You are currently on the <strong>{plan}</strong> plan.
            {isActive && plan !== "Free" ? " (Subscription Active)" : ""}
          </s-paragraph>
        </s-section>

        <div className={styles.pricingGrid}>
          {pricingPlans.map((item) => (
            <div
              key={item.name}
              className={`${styles.planCard} ${item.isRecommended ? styles.recommended : ""}`}
            >
              {item.isRecommended && (
                <div className={styles.badge}>Best Value</div>
              )}

              <div className={styles.planHeader}>
                <p className={styles.planName}>{item.name}</p>
                <p className={styles.planPrice}>
                  ${item.price}
                  <span>/mo</span>
                </p>
                <p className={styles.planDescription}>{item.description}</p>
              </div>

              <ul className={styles.featureList}>
                {item.features.map((feature, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <span className={styles.checkmark}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Form method="post" reloadDocument>
                <input type="hidden" name="plan" value={item.name} />
                <div className={styles.planButtonWrapper}>
                  <s-button
                    type="submit"
                    variant={item.isRecommended ? "primary" : undefined}
                    disabled={item.isCurrent}
                  >
                    {item.isCurrent
                      ? "Current Plan"
                      : item.name === "Free"
                        ? "Select Free"
                        : "Upgrade to " + item.name}
                  </s-button>
                </div>
              </Form>
            </div>
          ))}
        </div>

        <s-section heading="Billing Documents">
          <s-paragraph>
            You can view your invoices in your{" "}
            <s-link
              href="https://admin.shopify.com/settings/billing"
              target="_blank"
            >
              Shopify Admin
            </s-link>
            .
          </s-paragraph>
        </s-section>
      </div>

      <s-section slot="aside" heading="Premium Support">
        <s-paragraph>
          Need a custom plan for your enterprise?
          <s-link href="mailto:support@proofpulse.com">Contact us</s-link> for a
          tailored solution.
        </s-paragraph>
      </s-section>
    </s-page>
  );
}
