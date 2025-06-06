import isEqual from "lodash.isequal";
import { useEffect, useState } from "react";
import { CACHE_SIZE, getFrequencyColor } from "../../helpers/constants";
import { useAlgoStore } from "../../store/algo-store";
import { TMapItem } from "../../store/algo-store.type";
import { Card, CardHeader } from "../common";

export const Map = () => {
  const { map } = useAlgoStore((state) => {
    return {
      map: state.mapState.map,
    };
  }, isEqual);
  const [mapArr, setMapArray] = useState<TMapItem[]>([]);

  useEffect(() => {
    const arr: TMapItem[] = [];
    map.forEach((value, key) => {
      arr.push({ key, data: value });
    });
    setMapArray(arr);
  }, [map]);

undefined

  return (
    <Card>
      <CardHeader>
        Map{" "}
        <span className="text-end text-sm ml-1 !font-normal">
          [{" "}
          <span className="relative cursor-help after:absolute after:border-[2px] after:border-b-0 after:left-0 after:right-0 after:-bottom-0.5 after:border-blue-800 after:border-dashed before:content-['Capacity_of_Caching_Items'] before:absolute before:origin-top-left before:scale-0 hover:before:scale-100 before:rounded before:font-normal before:whitespace-nowrap before:mt-1 before:px-2 before:py-0.5 before:bg-slate-100 before:border before:border-slate-300 before:left-0 before:top-full before:text-xs before:h-6 before:transition-transform before:duration-300 before:will-change-transform before:tracking-wide before:shadow-md">
            Cache Size
          </span>
          : {CACHE_SIZE} ]
        </span>
      </CardHeader>
      <div className="p-1.5">
        <table className="w-full [&_th]:font-semibold [&_th]:text-sm [&_td]:text-xs [&_th]:border [&_td]:border [&_th]:p-1.5 [&_td]:p-1 [&_td]:text-center">
          <thead>
            <tr>
              <th>&lt;Key, Value&gt;</th>
              <th>Frequency</th>
              <th>Indicator</th>
            </tr>
          </thead>
          <tbody>
            {mapArr.length ? (
              mapArr.map((item) => {
                const frequency = item.data.frequency || 1;
                return (
                  <tr key={item.key}>
                    <td>
                      &lt;{item.key}, {item.data.value}&gt;
                    </td>
                    <td>{frequency}</td>
                    <td>
                      <div className="flex items-center justify-center">
                        <span 
                          className="inline-block w-4 h-4 rounded-full" 
                          style={{ backgroundColor: getFrequencyColor(frequency) }}
                          title={`Frequency: ${frequency}`}
                        ></span>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3}>Map is empty.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
