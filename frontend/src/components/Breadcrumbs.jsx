import { Link } from "react-router-dom";

const Breadcrumbs = ({ path }) => {
  if (!path || path === "/") {
    return <span className="text-ink/60">Root</span>;
  }

  const parts = path.split("/").filter(Boolean);
  const crumbs = parts.map((segment, index) => ({
    label: segment,
    url: index === parts.length - 1 ? null : "#",
  }));

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <Link to="/dashboard" className="text-ink/60 hover:text-ink">
        Root
      </Link>
      {crumbs.map((crumb, idx) => (
        <span key={`${crumb.label}-${idx}`} className="flex items-center gap-2">
          <span className="text-ink/30">/</span>
          <span className="font-medium text-ink">{crumb.label}</span>
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;
