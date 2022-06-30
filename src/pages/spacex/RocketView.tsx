import { FC } from 'react';
import RocketDonut from '../../components/entity/spacex/Donut';
import PayLoadlinePlot from '../../components/entity/spacex/LinePlot';
import PayloadColumnPlot from '../../components/entity/spacex/ColumnPlot';
import SuccessStatistic from '../../components/entity/spacex/LaunchSuccessStatistic';

const TestOverview: FC = () => (
  <div className="space-y-4">
    <RocketDonut />
    <SuccessStatistic />
    <PayLoadlinePlot />
    <PayloadColumnPlot />
  </div>
);

export default TestOverview;
