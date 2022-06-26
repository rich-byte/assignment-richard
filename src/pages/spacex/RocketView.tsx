import { FC } from 'react';
import RocketDonut from '../../components/entity/spacex/Donut';
import Test from '../../components/entity/spacex/Test';

const TestOverview: FC = () => (
  <div className="space-y-4 text-right">
    <Test />
    <RocketDonut />
  </div>
);

export default TestOverview;
