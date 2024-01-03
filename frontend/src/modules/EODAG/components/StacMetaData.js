// import React, { useState, useEffect } from 'react';
// import MetadataGroup from './MetadataGroup'; // Adjust the import path as needed

// // Additional imports and utility functions
// import {
//   formatAsset,
//   formatCatalog,
//   formatCollection,
//   formatGrouped,
//   formatItemProperties,
//   formatLink,
//   formatProvider,
//   formatSummaries
// } from '@radiantearth/stac-fields';
// import { isoDuration } from '@musement/iso-duration';
// // import your locale data, context, and other utilities as needed

// const Metadata = ({
//   data,
//   type,
//   context = null,
//   ignoreFields = [],
//   title = true,
//   headerTag = 'h2'
// }) => {
//   const [formattedData, setFormattedData] = useState([]);

//   // Equivalent of Vue's computed properties and methods
//   const titleText = typeof title === 'string' ? title : 'Default Title'; // Replace with your translation logic

//   useEffect(() => {
//     // Update durations and format data, similar to Vue's watcher
//     const updateData = async () => {
//       // Your logic to update the language and format data
//       const en = {}; // Load your locale data here
//       isoDuration.setLocales({ en });
//       setFormattedData(formatData());
//     };

//     updateData();
//   }, [uiLanguage, data, type, context, ignoreFields]);

//   const formatData = () => {
//     // Your formatData method logic
//   };

//   return (
//     <section className={`metadata ${formattedData.length > 0 ? '' : 'hidden'}`}>
//       {title && React.createElement(headerTag, null, titleText)}
//       <div className={`count-${formattedData.length}`}>
//         {formattedData.map((group) => (
//           <MetadataGroup key={group.extension} {...group} />
//         ))}
//       </div>
//     </section>
//   );
// };

// export default Metadata;
