interface DetailedMetricsSectionContainerProps {
  children: React.ReactNode;
  title: string;
}

export function DetailedMetricsSectionContainer({
  children,
  title,
}: DetailedMetricsSectionContainerProps) {
  return (
    <div>
      <span className="font-medium text-gray-700">{title}</span>
      <div className="pl-2">
        <div className="flex flex-col gap-1">{children}</div>
      </div>
    </div>
  );
}
