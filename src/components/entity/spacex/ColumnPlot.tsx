import { Column } from '@ant-design/plots';
import { Card } from 'antd';
import { FC } from 'react';
import { QueryClientProvider } from 'react-query';
import { usePayloadsQuery } from '../../../types/types.d';
import { queryClient, graphqlClient } from './Clients';

const PayloadColumnPlot: FC = () => {
  const result = usePayloadsQuery(graphqlClient);
  const data: {
    month: string;
    payloadkg: number;
  }[] = [];

  // takes one number per month and a number of the added payload in kg
  const monthlyPayloadMap = new Map<number, number>();

  // on load
  if (result.data?.launchesPast !== undefined) {
    const count = result.data.launchesPast?.length as number;
    for (let i = 0; i < count; i++) {
      const currentLaunch = result.data.launchesPast?.at(i);
      const dateStr: string = currentLaunch?.launch_date_local as string;
      const date: Date = new Date(dateStr);
      const month: number = date.getMonth() + 1;
      const payloadkg =
        currentLaunch?.rocket?.second_stage?.payloads?.at(0)?.payload_mass_kg;

      if (payloadkg === null || payloadkg === undefined) {
        continue;
      }
      if (monthlyPayloadMap.has(month)) {
        const updatedPayload = ((monthlyPayloadMap.get(month) as number) +
          payloadkg) as number;
        monthlyPayloadMap.set(month, updatedPayload);
      } else {
        monthlyPayloadMap.set(month, payloadkg);
      }
    }

    // add payload of 0 for all months without data
    for (let i = 1; i <= 12; i++) {
      if (!monthlyPayloadMap.has(i)) {
        monthlyPayloadMap.set(i, 0);
      }
    }

    // create Column Plot data
    for (const monthlyPayload of monthlyPayloadMap) {
      const monthlyPayloadData: { month: string; payloadkg: number } = {
        month: monthlyPayload[0].toString(),
        payloadkg: monthlyPayload[1],
      };
      data.push(monthlyPayloadData);
    }

    // sort by ascending months so that data is displayed correctly in plot
    data.sort((a, b) =>
      parseInt(a.month, 10) < parseInt(b.month, 10) ? -1 : 1
    );
  }

  const config = {
    data,
    xField: 'month',
    yField: 'payloadkg',
  };

  return (
    <Card title="Payloads(kg) in 2020 per month">
      <Column {...config} />
    </Card>
  );
};

export default function Wrapped() {
  return (
    <QueryClientProvider client={queryClient}>
      <PayloadColumnPlot />
      <br />
    </QueryClientProvider>
  );
}
