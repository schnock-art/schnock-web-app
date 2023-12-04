import React, {useState, useEffect} from 'react';
import { StorageManager, StorageImage } from '@aws-amplify/ui-react-storage';
import { ThemeProvider, Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'
import './App.css';
import { list } from 'aws-amplify/storage';
import ImageModal from './components/ImageModal';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';


const globalTheme = {
  name: 'my-theme',
  tokens: {
    borderWidths: {
      small: '2px',
    },
    components: {
      storagemanager: {
        dropzone: {
          borderColor: '{colors.primary.60}',
        },
      },
    },
  },
};


const App = () =>{
  const [images, setPhotos] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAuthenticator, setShowAuthenticator] = useState(false);
  const [user, setUser] = useState(null);
  
  // Function to check the current user session
  useEffect(() => {
    getCurrentUser()
      .then(user => setUser(user))
      .catch(() => setUser(null));
  }, []);

  // Function to listen to auth events using Hub
  useEffect(() => {
    const listener = ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          console.log('user have been signedIn successfully.');
          getCurrentUser().then(user => setUser(user));
          break;
        case 'signedOut':
          console.log('user have been signedOut successfully.');
          setUser(null);
          break;
        case 'tokenRefresh':
          console.log('auth tokens have been refreshed.');
          break;
        case 'tokenRefresh_failure':
          console.log('failure while refreshing auth tokens.');
          break;
        case 'signInWithRedirect':
          console.log('signInWithRedirect API has successfully been resolved.');
          break;
        case 'signInWithRedirect_failure':
          console.log('failure while trying to resolve signInWithRedirect API.');
          break;
        case 'customOAuthState':
          console.log('custom state returned from CognitoHosted UI');
          break;
        default:
          break;
      }
    };

  Hub.listen('auth', listener);
    
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setShowAuthenticator(false);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  
  const handleImageSelect = (imgKey) => {
      setSelectedImage(imgKey);
  };

  const handleCloseModal = () => {
      setSelectedImage(null);
  };


  const processFile = async ({ file }) => {
    // Extract the path and filename
    const pathArray = "photos".split('/');
    const fileName = file.name;
    const path = pathArray.join('/') + (pathArray.length > 0 ? '/' : '');
    const fileExtension = fileName.split('.').pop();
    console.log('File:', file);
    console.log('patharray', pathArray)
    console.log('File Extension:', fileExtension);
    console.log('File Name:', fileName);
    console.log('Path:', path);
   

    return file
      .arrayBuffer()
      .then(filebuffer => window.crypto.subtle.digest('SHA-1', filebuffer))
      .then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(a => a.toString(16).padStart(2, '0')).join('');
        
        // Construct the key with the path and hashed filename
        const hashedFileName = `${hashHex}.${fileExtension}`;
        const key = `${path}${hashedFileName}`;

        return {
          file,
          key,
          metadata: {
            id: key,
            name: fileName, // Original file name
          },
        };
      });
  };

  const fetchPhotos = async() => {
    try {
      // Fetch all files from the 'photos/' directory
      const response = await list({ 
        prefix: 'photos/',
        postfix: '.jpg',
        options: { 
          accessLevel: 'public', 
          listAll: true 
        } 
      });
      console.log('Listed Items:', response.items);

      const validPhotos = response.items
      .filter(item => item.key && item.key.trim() !== 'photos/') // Filter out empty or whitespace-only keys

      // Filter and process the response to get photo URLs
      setPhotos(validPhotos.map(file => file.key)); // Assuming file has a URL attribute
      console.log('Photos:', validPhotos);
    } catch (error) {
      console.error('Error fetching photos', error);
    }
  };

  // Fetch and set images from storage on component mount
  useEffect(() => {
      fetchPhotos();
  }, []);


  useEffect(() => {
    console.log('Updated Photos:', images);
  }, [images]);

  return (
    <ThemeProvider theme={globalTheme}>
      
      <header className="App-header">
      
              {user ? (
                <div>
                  Welcome, {user.username}!
                  <button onClick={handleSignOut}>Logout</button>
                </div>
              ) : (
                <div>
                  Welcome, Guest!
                  <button onClick={() => setShowAuthenticator(true)}>Login</button>
                </div>
              )}
            </header>
      {showAuthenticator && (
      <Authenticator variation='modal'>
        {({ signOut, user }) => user && (
          <>
            {user && (
              <StorageManager
              acceptedFileTypes={[
                // you can list file extensions:
                //'.gif',
                //'.bmp',
                //'.doc',
                '.jpeg',
                '.jpg',
                // or MIME types:
                '.png',
              ]}
              accessLevel="guest"
              maxFileCount={5}
              autoUpload={false}
              // Size is in bytes
              maxFileSize={1000000}
              processFile={processFile}
              path="photos/"
              onUploadSuccess={fetchPhotos}
              CacheControl="max-age=86400"
            />
            )}
          </>
        )}
      </Authenticator>
      )}
      <div><h1>Photo Gallery</h1></div>
      <div className="photo-gallery">
        {images.map(photo => (
          <StorageImage
            alt={photo}
            key={photo}
            imgKey={photo}
            accessLevel="public"
            style={{ width: '100%', height: '100%' }} // This ensures the image takes the full size of its container
            onStorageGetError={(error) => console.error(error)}
            onClick={() => handleImageSelect(photo)} // Add click handler
        />
        ))}
      </div>

      {selectedImage && (
        <ImageModal imgKey={selectedImage} onClose={handleCloseModal} />
      )}
    </ThemeProvider>
  );
};

export default App;
