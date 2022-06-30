import { FC } from 'react';
import { useLaunchSuccessQuery } from '../../../types/types.d';
import { Card, Col, Row, Statistic } from 'antd';
import { QueryClientProvider } from 'react-query';
import { queryClient, graphqlClient } from './Clients';

const SuccessStatistic: FC = () => {
  const result = useLaunchSuccessQuery(graphqlClient);

  let totalCount = 0;
  let currLaunchCount = 0;
  let overallSuccessRate = 0;
  let currSuccessRate = 0;
  let currSuccessRateStr = '';
  let isLoading = true;

  // on load
  if (
    result.data?.launchesPastResult?.data !== undefined &&
    result.data?.launchesPastResult?.data !== null
  ) {
    const resultData = result.data.launchesPastResult.data;

    totalCount = result.data.launchesPastResult?.result?.totalCount as number;
    currLaunchCount = 0;
    let successCount = 0;
    let currSuccessCount = 0;

    for (let i = 0; i < totalCount; i++) {
      const currLaunch = resultData[i];
      const isLaunchSuccess: boolean = currLaunch?.launch_success as boolean;

      const launchDateStr: string = currLaunch?.launch_date_local as string;
      const launchDate: Date = new Date(launchDateStr);
      const lastCurrDate: Date = new Date();
      lastCurrDate.setMonth(lastCurrDate.getMonth() - 6);
      let isInCurrentPeriod = false;

      if (launchDate >= lastCurrDate) {
        isInCurrentPeriod = true;
        currLaunchCount++;
      }

      if (isLaunchSuccess) {
        successCount++;
        if (isInCurrentPeriod) {
          currSuccessCount++;
        }
      }
    }

    overallSuccessRate = (successCount / totalCount) * 100;
    currSuccessRate = (currSuccessCount / currLaunchCount) * 100;

    currSuccessRateStr = `${currSuccessRate}%`;

    if (currLaunchCount === 0) {
      currSuccessRateStr = 'No recorded launches. Check back soon!';
    }

    isLoading = false;
  }

  return (
    <Card title="Success of launches ">
      <Row gutter={16}>
        <Col span={12}>
          <Statistic
            title="Overall Success"
            value={overallSuccessRate}
            precision={2}
            suffix="%"
            loading={isLoading}
          />
        </Col>

        <Col span={12}>
          <Statistic
            title="Success in the last 6 months"
            value={currSuccessRateStr}
            loading={isLoading}
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Statistic
            title="Total launches"
            value={totalCount}
            loading={isLoading}
          />
        </Col>

        <Col span={12}>
          <Statistic
            title="Total launches"
            value={currLaunchCount}
            loading={isLoading}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default function Wrapped() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuccessStatistic />
    </QueryClientProvider>
  );
}
