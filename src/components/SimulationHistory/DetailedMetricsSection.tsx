interface DetailedMetricsSectionProps {
  title: string;
  value: string | number;
}

export function DetailedMetricsSection({
  title,
  value,
}: DetailedMetricsSectionProps) {
  return (
    <div>
      <span className="font-medium text-gray-600">{title}:</span>{' '}
      <span className="text-gray-800">{value}</span>
    </div>
  );
}
