import { MarketItem } from "./types";

interface PurchasesPanelProps {
  purchased: MarketItem[];
}

const PurchasesPanel = ({ purchased }: PurchasesPanelProps) => (
  <div
    className="mb-5 rounded-3xl p-4"
    style={{
      background: "linear-gradient(135deg,#faf5ff,#ede9fe88)",
      border: "2px solid #ddd6fe",
      boxShadow: "0 4px 20px rgba(139,92,246,0.1)",
    }}
  >
    <p className="text-sm font-extrabold text-violet-800 mb-3">
      My Requests ({purchased.length})
    </p>
    <div className="flex flex-col gap-2">
      {purchased.map((it) => (
        <div
          key={it.id}
          className="flex items-center justify-between px-3 py-2.5 rounded-2xl"
          style={{
            background: "#fff",
            border: "1.5px solid #ede9fe",
          }}
        >
          <div>
            <p className="text-xs font-bold text-gray-800">{it.name}</p>
            <p className="text-[11px] text-gray-400 line-clamp-1">
              {it.description}
            </p>
          </div>
          <span
            className="ml-3 text-xs font-extrabold px-2.5 py-1 rounded-xl shrink-0"
            style={{ background: "#ede9fe", color: "#6d28d9" }}
          >
            रु{it.price.toLocaleString("en-IN")}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default PurchasesPanel;
