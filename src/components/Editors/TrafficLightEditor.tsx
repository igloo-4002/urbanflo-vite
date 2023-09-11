import { useFieldArray, useForm } from 'react-hook-form';

type Phase = {
  duration: number;
  state: string;
};

type Data = {
  rows: Phase[];
};

export function TrafficLightEditor() {
  const { register, handleSubmit, control } = useForm<Data>({
    defaultValues: {
      rows: [{ duration: 1, state: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rows',
  });

  async function onSubmit(data: Data) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <table className="bg-white rounded-md overflow-hidden min-w-full">
        <thead>
          <tr>
            <th className="py-2 px-3 bg-gray-200 text-left text-sm font-medium text-gray-600 uppercase">
              Duration
            </th>
            <th className="py-2 px-3 bg-gray-200 text-left text-sm font-medium text-gray-600 uppercase">
              State
            </th>
            <th className="py-2 px-3 bg-gray-200"></th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => {
            return (
              <tr key={field.id} className="hover:bg-gray-50">
                <td className="py-2 px-3 border-b">
                  <input
                    className="border rounded-md p-2 w-full"
                    {...register(`rows.${index}.duration`)}
                  />
                </td>
                <td className="py-2 px-3 border-b">
                  <input
                    className="border rounded-md p-2 w-full"
                    {...register(`rows.${index}.state`)}
                  />
                </td>
                <td className="py-2 px-3 border-b">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-3">
        <button
          type="button"
          onClick={() => append({ duration: 1, state: '' })}
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Add Row
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
