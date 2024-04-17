import { Helmet } from 'react-helmet-async';
import { labelStudioURL, labelStudioCookies } from 'utils/constants';

const LabelStudioView = () => {
  // set cookie for label studio sign in
  document.cookie = document.cookie
    ? `${document.cookie}; ${labelStudioCookies}`
    : labelStudioCookies;
  return (
    <>
      <Helmet>
        <title>Labelling | data.all</title>
      </Helmet>
      <iframe
        title="Label Studio"
        src={labelStudioURL}
        width="100%"
        height="100%"
        style={{ display: 'block' }}
        allow="cookie"
        sandbox="allow-forms allow-cookies allow-scripts allow-same-origin allow-popups"
      ></iframe>
    </>
  );
};

export default LabelStudioView;
