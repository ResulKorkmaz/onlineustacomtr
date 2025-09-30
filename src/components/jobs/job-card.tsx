import Link from "next/link";
import { MapPin, Calendar, DollarSign } from "lucide-react";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import type { Job } from "@/lib/types/database.types";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="rounded-2xl border bg-white p-6 transition-shadow hover:shadow-lg">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-lg font-semibold line-clamp-2">{job.title}</h3>
          <span className="ml-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
            {job.bid_count} Teklif
          </span>
        </div>

        <p className="mb-4 text-sm text-gray-600 line-clamp-3">{job.description}</p>

        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{job.city}{job.district && `, ${job.district}`}</span>
          </div>
          
          {job.budget_min && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>
                {formatCurrency(job.budget_min)} - {formatCurrency(job.budget_max || job.budget_min)}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatRelativeTime(job.created_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
