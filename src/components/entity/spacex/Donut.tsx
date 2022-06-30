import { Pie } from '@ant-design/plots';
import { FC } from 'react';
import { useRocketsQuery } from '../../../types/types.d';
import { QueryClientProvider } from 'react-query';
import { Card } from 'antd';
import { queryClient, graphqlClient } from './Clients';

const RocketDonut: FC = () => {
  const typeMap = new Map<string, number>();
  const result = useRocketsQuery(graphqlClient);

  const data: {
    type: string;
    value: number;
  }[] = [];

  // on load
  if (result.data?.ships !== undefined) {
    // add up the number of ships of distinct types
    const count = result.data.ships?.length as number;
    for (let i = 0; i < count; i++) {
      const typeName = result.data.ships?.at(i)?.type as string;
      if (typeMap.has(typeName)) {
        const updatedCount = (typeMap.get(typeName) as number) + 1;
        typeMap.set(typeName, updatedCount);
      } else {
        typeMap.set(typeName, 1);
      }
    }

    // create the donut chart data
    for (const shipType of typeMap.entries()) {
      const shipData: { type: string; value: number } = {
        type: shipType[0],
        value: shipType[1],
      };
      data.push(shipData);
    }
  }

  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: 'Ship Types',
      },
    },
  };

  return (
    <Card title="Ship Types by build count">
      <Pie {...config} />
    </Card>
  );
};

export default function Wraped() {
  return (
    <QueryClientProvider client={queryClient}>
      <RocketDonut />
    </QueryClientProvider>
  );
}
