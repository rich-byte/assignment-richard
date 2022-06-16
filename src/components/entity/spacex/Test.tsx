import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { request, gql } from 'graphql-request';
import { FC, MouseEventHandler } from 'react';

const EntityCreateButton: FC = () => (
  <Button icon={<PlusOutlined />} onClick={clickHandler}>
    Get Rocket data
  </Button>
);

const clickHandler: MouseEventHandler = () => {
  getRocketData();
};

async function getRocketData() {
  const API_URL = 'https://api.spacex.land/graphql/';
  const query = gql`
    {
      rockets(limit: 10) {
        cost_per_launch
        id
        name
        type
      }
    }
  `;

  await request(API_URL, query).then((data) => console.log(data));
}

export default EntityCreateButton;
