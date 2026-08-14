import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { PremiumShell } from "../../components/premium/PremiumShell";
import { Badge } from "../../components/ui";
import { Card } from "../../components/ui/Card";
import { circlePosts } from "../../data/premium";
import { formatWhen } from "../../lib/format";

export function CommunityPage() {
  const { t } = useTranslation();
  return (
    <PremiumShell title={t("plus.circleTitle")} lede={t("plus.circleLede")}>
      <div className="space-y-4">
        {circlePosts.map((p) => (
          <Card key={p.id} className="p-5">
            <div className="flex items-start gap-3">
              <img src={p.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link to={`/farmers/${p.farmerId}`} className="font-medium hover:text-primary">
                    {p.author}
                  </Link>
                  <span className="text-xs text-muted">{p.farm}</span>
                  <Badge tone="muted">{p.crop}</Badge>
                </div>
                <p className="text-[11px] text-muted">{formatWhen(p.at)}</p>
                <h3 className="mt-2 font-display text-xl">{p.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{p.body}</p>
                <p className="mt-3 flex gap-4 text-xs text-muted">
                  <span className="inline-flex items-center gap-1">
                    <ThumbsUp size={12} /> {p.likes}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle size={12} /> {p.replies}
                  </span>
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PremiumShell>
  );
}
