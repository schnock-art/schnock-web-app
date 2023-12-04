import { list } from 'aws-amplify/storage';
import { StorageImage } from '@aws-amplify/ui-react-storage';





export const StorageImageErrorHandlingExample = () => {
    try {
        const result = await list({
            prefix: ''
        });
        } catch (error) {
        console.log(error);
    }
      
  return (
    <StorageImage
      alt="fallback cat"
      imgKey="1251447.jpg"
      accessLevel="public"
      fallbackSrc="/fallback_cat.jpg"
      onStorageGetError={(error) => console.error(error)}
    />
  );
};
