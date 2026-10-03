import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { transactions } from "../data/orders";
import { useOrders } from "../app/providers/OrdersProvider";
import { razorpayReady } from "../lib/orderFlow";
import { inr, formatDate } from "../lib/format";
import { Card, SectionHead } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui";
import { apiConfigured } from "../lib/api";
import { fetchPayments, fetchWalletBalance, type PaymentRecord } from "../lib/api/payments";
import { createWalletTopup, verifyWalletTopup } from "../lib/api/wallet";
import { openRazorpayCheckout } from "../lib/razorpay";

export function PaymentsPage() {
  const { t } = useTranslation();
  const { orders } = useOrders();
  const [payments, setPayments] = useState<PaymentRecord[] | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [topupAmount, setTopupAmount] = useState<number>(500);
  const [topupLoading, setTopupLoading] = useState(false);
  const visiblePayments = payments ?? transactions.map((transaction) => ({
    _id: transaction.id,
    order: transaction.orderId,
    method: transaction.method === "upi" || transaction.method === "card" || transaction.method === "netbanking" ? "razorpay" : transaction.method,
    amount: transaction.amount,
    status: transaction.status === "paid" ? "completed" : transaction.status,
    createdAt: transaction.at,
  }));
  const paid = visiblePayments.filter((x) => x.status === "completed").reduce((s, x) => s + x.amount, 0);
  const pending = visiblePayments
    .filter((x) => x.status === "pending")
    .reduce((s, x) => s + x.amount, 0);

  useEffect(() => {
    if (!apiConfigured()) return;
    void Promise.all([fetchPayments(), fetchWalletBalance()])
      .then(([nextPayments, wallet]) => {
        setPayments(nextPayments);
        setWalletBalance(wallet.balance);
      })
      .catch(() => {
        // Keep the demo data as an offline fallback.
      });
  }, []);

  const handleTopup = async () => {
    if (!apiConfigured()) return;
    setTopupLoading(true);
    try {
      const order = await createWalletTopup(topupAmount);
      const result = await openRazorpayCheckout({
        amountPaise: order.amount,
        razorpayOrderId: order.id,
        name: "Direct Farm Wallet Top-up",
        email: undefined,
        contact: undefined,
        note: `Topup ${topupAmount}`,
      });
      if (!result.ok) {
        setTopupLoading(false);
        return;
      }
      await verifyWalletTopup({
        razorpay_order_id: result.razorpayOrderId,
        razorpay_payment_id: result.paymentId,
        razorpay_signature: result.signature,
      });
      const wallet = await fetchWalletBalance();
      setWalletBalance(wallet.balance);
    } catch (err) {
      // ignore — api will show errors via global handler
    } finally {
      setTopupLoading(false);
    }
  };

  return (
    <div className="container-app py-8 sm:py-10">
      <SectionHead kicker={t("nav.payments")} title={t("payments.title")} />
      <p className="-mt-4 mb-4 text-sm text-ink-soft">{t("payments.subtitle")}</p>

      <div className="mb-6 rounded-[1.25rem] border border-secondary/30 bg-secondary-soft px-4 py-3 text-xs text-secondary-dark">
        {razorpayReady() ? t("flow.razorpayReady") : t("flow.razorpayWait")}
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">{t("payments.wallet")}</p>
          <p className="mt-2 font-display text-3xl text-nature">{inr(walletBalance ?? 2480)}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <input
              type="number"
              min={10}
              value={topupAmount}
              onChange={(e) => setTopupAmount(Number(e.target.value))}
              className="w-28 rounded-full border border-line bg-accent px-3 py-2 text-sm text-ink outline-none ring-0 transition focus:border-primary"
            />
            <Button
              size="sm"
              onClick={handleTopup}
              disabled={!apiConfigured() || topupLoading}
            >
              {topupLoading ? t("flow.openingPay") : t("payments.topup")}
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">{t("payments.escrow")}</p>
          <p className="mt-2 font-display text-3xl text-secondary">{inr(pending)}</p>
          <p className="mt-1 text-xs text-muted">
            {t("pay.paid")}: {inr(paid)}
          </p>
        </Card>
      </div>

      {orders[0] && (
        <p className="mb-4 text-sm text-ink-soft">
          <Link to={`/orders/${orders[0].id}`} className="font-medium text-primary">
            {t("flow.viewOrder")} · {orders[0].id}
          </Link>
        </p>
      )}

      <h3 className="mb-3 font-display text-2xl text-ink">{t("payments.recent")}</h3>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-accent text-xs uppercase tracking-[0.15em] text-muted">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">{t("nav.orders")}</th>
                <th className="px-4 py-3">{t("payments.method")}</th>
                <th className="px-4 py-3">{t("payments.amount")}</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {visiblePayments.map((tx) => (
                <tr key={tx._id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">{tx._id}</td>
                  <td className="px-4 py-3 text-ink-soft">
                    {typeof tx.order === "string" ? tx.order : tx.order._id}
                    <p className="mt-1 text-xs text-muted">{formatDate(tx.createdAt)}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{tx.method}</td>
                  <td className="px-4 py-3 font-medium text-ink">{inr(tx.amount)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={tx.status === "completed" ? "nature" : "secondary"}>
                      {t(`pay.${tx.status}`)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
