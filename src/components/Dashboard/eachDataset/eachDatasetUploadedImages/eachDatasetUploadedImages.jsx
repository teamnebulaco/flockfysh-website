import DatasetImage from '../datasetImage/datasetImage';

import classes from './eachDatasetUploadedImages.module.css';

export default function EachDatasetUploadedImages(props) {
   let testImages = [];

   for (let i = 0; i < 20; i++) {
      testImages.push(props.dataset.uploadedImages[0]);
   }

   return (
      <div className={ classes.uploadedImages }>
         <div className={ classes.uploadedImagesContentContainer }>
            <h1>Uploaded images</h1>

            <div className={ classes.uploadedImagesContainer }>
               {
                  testImages.map(
                     (image, index) => (
                        <DatasetImage key={ index } image={ image } />
                     )
                  )
               }
            </div>
         </div>
      </div>
   );
}

