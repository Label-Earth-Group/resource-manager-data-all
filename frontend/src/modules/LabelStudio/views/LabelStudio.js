import { Helmet } from 'react-helmet-async';
import { labelStudioURL } from 'utils/constants';

const LabelStudioView = () => {
  return (
    <>
      <Helmet>
        <title>Labelling | data.all</title>
      </Helmet>
      <embed
        title="Label Studio"
        src={labelStudioURL}
        width="100%"
        height="100%"
        style={{
          display: 'block'
        }}
      ></embed>
    </>
  );
};

export default LabelStudioView;
