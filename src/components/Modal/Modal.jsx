import PropTypes from 'prop-types';
import { Component } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

const modalRoot = document.querySelector('#root');

export default class Modal extends Component {
  static propTypes = {
    modalData: PropTypes.shape({
      currentImageUrl: PropTypes.string.isRequired,
      currentImageDescription: PropTypes.string.isRequired,
    }),
    onModalClose: PropTypes.func,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleClickBackdrop = e => {
    if (e.target === e.currentTarget) {
      this.props.onClose();
    }
  };

  handleKeyDown = e => {
    if (e.code === 'Escape') {
      this.props.onClose();
    }
  };

  render() {
    const { currentImageUrl, currentImageDescription } = this.props;

    return createPortal(
      <div className={css.overlay} onClick={this.handleClickBackdrop}>
        <div className={css.modal}>
          <img src={currentImageUrl} alt={currentImageDescription} />
        </div>
      </div>,
      modalRoot
    );
  }
}
