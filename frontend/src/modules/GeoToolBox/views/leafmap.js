import { Helmet } from 'react-helmet-async';
import { leafmapURL } from 'utils/constants';

const leafmapView = () => {
  return (
    <>
      <Helmet>
        <title>GeoToolbox | data.all</title>
      </Helmet>
      <embed
        title="leafmap"
        src={leafmapURL}
        width="100%"
        height="100%"
        style={{
          display: 'block'
        }}
      ></embed>
    </>
  );
};

export default leafmapView;
