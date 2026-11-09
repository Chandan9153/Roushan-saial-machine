import { PackageSearch } from 'lucide-react';

export default function EmptyState({ title, message }) {
  return (
    <div className="card flex flex-col items-center gap-2 px-6 py-12 text-center">
      <PackageSearch size={36} className="text-slate-300" />
      <p className="font-semibold">{title}</p>
      <p className="max-w-md text-sm text-slate-500">{message}</p>
    </div>
  );
}
