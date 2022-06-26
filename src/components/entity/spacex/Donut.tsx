import { Pie } from '@ant-design/plots';
import { FC } from 'react';
import { useRocketsQuery } from '../../../types/types.d';
import { GraphQLClient } from 'graphql-request';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Card } from 'antd';

const RocketDonut: FC = () => {
  const typeMap = new Map<string, number>();
  const client = new GraphQLClient('https://api.spacex.land/graphql/');
  const resultData = useRocketsQuery(client);

  const data: {
    type: string;
    value: number;
  }[] = [];

  // on load
  if (resultData.data?.ships !== undefined) {
    // add up the number of ships of distinct types
    const count = resultData.data.ships?.length as number;
    for (let i = 0; i < count; i++) {
      const typeName = resultData.data.ships?.at(i)?.type as string;
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
    <Card title="Ship Types">
      <Pie {...config} />
    </Card>
  );
};

const queryClient = new QueryClient();

export default function Wraped() {
  return (
    <QueryClientProvider client={queryClient}>
      <RocketDonut />
    </QueryClientProvider>
  );
}
