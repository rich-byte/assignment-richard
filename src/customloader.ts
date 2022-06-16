import { request, gql } from 'graphql-request';

const API_URL = 'https://api.spacex.land/graphql/';

const query = gql`
    query spacex {
        {
            launchesPast(limit: 10) {
              mission_name
              launch_date_local
              launch_site {
                site_name_long
              }
              links {
                article_link
                video_link
              }
              rocket {
                rocket_name
                first_stage {
                  cores {
                    flight
                    core {
                      reuse_count
                      status
                    }
                  }
                }
                second_stage {
                  payloads {
                    payload_type
                    payload_mass_kg
                    payload_mass_lbs
                  }
                }
              }
              ships {
                name
                home_port
                image
              }
            }
            rocketsResult {
              data {
                type
              }
            }
          }
    }
`;

request(API_URL, query).then((data) => console.log(data));
