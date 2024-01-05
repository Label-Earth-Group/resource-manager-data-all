import { Helmet } from 'react-helmet-async';

const leafmapView = () => {
  return (
    <>
      <Helmet>
        <title>GeoToolbox | data.all</title>
      </Helmet>
      <embed
        title="leafmap"
        src="http://118.31.15.5:8088/"
        width="100%"
        height="100%"
      ></embed>
    </>
  );
};

export default leafmapView;
