import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fetchImages from '../services/images-api';
import Searchbar from 'components/Searchbar';
import ImageGallery from 'components/ImageGallery';
import Button from 'components/Button';
import Loader from 'components/Loader';
import Modal from 'components/Modal/Modal';

const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalImages, setTotalImages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    if (!query) return;

    const fetchImagesData = async () => {
      try {
        setIsLoading(true);

        const { hits, totalHits } = await fetchImages(query, page);

        if (!totalHits) {
          alert(`Oops... there are no images matching your search...`);
          return;
        }

        const imagesArray = hits.map(hit => ({
          id: hit.id,
          description: hit,
          smallImage: hit.webformatURL,
          largeImage: hit.largeImageURL,
        }));

        setImages(prevImages => [...prevImages, ...imagesArray]);
        setTotalImages(totalHits);
      } catch (error) {
        console.log('~ file: App.jsx:44 ~ fetchData ~ error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImagesData();
  }, [query, page]);

  const getSearchRequest = query => {
    setQuery(query);
    setPage(1);
    setImages([]);
    setTotalImages(0);
  };

  const onNextFetch = () => {
    setPage(prevPage => prevPage + 1);
  };

  const toggleModal = (modalData = null) => {
    setModalData(modalData);
  };

  return (
    <>
      <Searchbar onSubmit={getSearchRequest} />

      {images && <ImageGallery images={images} openModal={toggleModal} />}

      {isLoading && <Loader />}

      {!isLoading && images.length !== totalImages && (
        <Button onNextFetch={onNextFetch} />
      )}

      {modalData && (
        <Modal
          onModalClose={toggleModal}
          modalData={{
            currentImageUrl: modalData.largeImage,
            currentImageDescription: modalData.description,
          }}
        />
      )}

      <ToastContainer />
    </>
  );
};

export default App;
