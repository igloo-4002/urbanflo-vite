interface DetailedMetricsContainerProps {
  show: boolean;
  children: React.ReactNode;
}

export function DetailedMetricsContainer({
  show,
  children,
}: DetailedMetricsContainerProps) {
  if (!show) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 mt-6 bg-gray-100 p-3 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-700">
        Detailed Simulation Metrics
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
