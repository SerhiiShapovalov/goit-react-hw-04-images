import { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fetchImages from '../services/images-api';
import Searchbar from 'components/Searchbar';
import ImageGallery from 'components/ImageGallery';
import Button from 'components/Button';
import Loader from 'components/Loader';
import Modal from 'components/Modal/Modal';

class App extends Component {
  state = {
    query: '',
    page: 1,
    totalImages: 0,
    isLoading: false,
    images: [],
    error: null,
    modalData: null,
  };

  componentDidUpdate(prevProps, prevState) {
    const { query, page } = this.state;

    if (prevState.query !== query || prevState.page !== page) {
      this.setState({ isLoading: true });

      fetchImages(query, page)
        .then(({ hits, totalHits }) => {
          if (!totalHits) {
            alert(`Oops... there are no images matching your search... `);
            return;
          }
          const imagesArray = hits.map(hit => ({
            id: hit.id,
            description: hit.tags,
            smallImage: hit.webformatURL,
            largeImage: hit.largeImageURL,
          }));

          this.setState(({ images }) => {
            return {
              images: [...images, ...imagesArray],
              totalImages: totalHits,
            };
          });
        })
        .catch(error => this.setState({ error }))
        .finally(() => this.setState({ isLoading: false }));
    }
  }

  getSearchRequest = query => {
    this.setState({ query, page: 1, images: [], totalImages: 0 });
  };

  onNextFetch = () => {
    this.setState(({ page }) => ({ page: page + 1 }));
  };

  toggleModal = (modalData = null) => {
    this.setState({ modalData });
  };

  render() {
    const {
      images,      
      totalImages,
      isLoading,      
      // currentImageUrl,
      // currentImageDescription,
      modalData,
    } = this.state;

    return (
      <>
        <Searchbar onSubmit={this.getSearchRequest} />

        {images && (
          <ImageGallery images={images} openModal={this.toggleModal} />
        )}

        {isLoading && <Loader />}

        {!isLoading && images.length !== totalImages && (
          <Button onNextFetch={this.onNextFetch} />
        )}

        {modalData && (
          <Modal
            onClose={this.toggleModal}
            currentImageUrl={modalData.largeImage}
            currentImageDescription={modalData.description}
          />
        )}

        <ToastContainer />
      </>
    );
  }
}

export default App;
