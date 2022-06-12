import Image from 'next/image';
import React, { PureComponent } from 'react';
import { Modal, Button } from "react-bootstrap";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'

export default class cropImage extends PureComponent {
  state = {
    src: null,
    show: false,
    set: false,
    base64Image: "",
    lastSrc:this.props.defaultImage,
    crop: {
      unit: '%',
      width: 300,
      aspect: this.props.aspect
    },

  };

  componentDidUpdate(prevProps) {
    if (this.props.name !== prevProps.name) {
      this.setState({ lastSrc: this.props.defaultImage })
    }
  
  }

  handleClose = () => { this.setState({ show: false }); this.setState({ set: true }); this.props.imgSrc(this.state.base64Image); this.setState({ lastSrc: this.state.base64Image}) }
  handleShow = () => { this.setState({ show: true }); }

  onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      this.setState({ show: true })
      reader.addEventListener('load', () => {
        this.setState({ src: reader.result });
      }
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // If you setState the crop in here you should return false.
  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  onCropComplete = (crop) => {
    this.makeClientCrop(crop);

  };

  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        'newFile.jpeg'
      );
      this.setState({ croppedImageUrl });
     
    }
  }



  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    if (this.props.circle) {
      ctx.globalCompositeOperation = "destination-in";
      ctx.beginPath();
      ctx.arc(
        crop.width * scaleX / 2,
        crop.height * scaleY / 2,
        Math.min(crop.width * scaleX, crop.height * scaleY) / 2,
        0,
        2 * Math.PI,
        true
      );
      ctx.fill();
    }
    const base64Image = canvas.toDataURL("image/png");
    this.setState({ base64Image: base64Image });
    return base64Image;
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            //reject(new Error('Canvas is empty'));
            console.error('Canvas is empty');
            return;
          }
          blob.name = fileName;
          window.URL.revokeObjectURL(this.fileUrl);
          this.fileUrl = window.URL.createObjectURL(blob);
          resolve(this.fileUrl);
        },
        'image/jpeg',
        1
      );
    });

  }

  render() {
    const { crop, croppedImageUrl, src } = this.state;

    return (
      <div className="">
        <div>
          <label className={` w-100 ${(this.props.aspect === 2 / 1) && "rectangle-img"}`} data-toggle="tooltip" data-original-title="Change your avatar">
            <div className="a-input-modal img" style={{
              aspectRatio: `${this.props.aspect}`,
            }}>
              <Image
                className="p-0 w-100 rounded-3 object-cover	"
                style={{
                  borderRadius: this.props.circle ? "50%" : "1rem",
                  objectFit: "cover",
                  aspectRatio: `${this.props.aspect}`,
                }}
                width={this.props.width}
                height={this.props.height}
                src={this.state.lastSrc}
                alt="avatar"
                layout="responsive"
              />
            </div>
            <input type="file" className="sr-only d-none" id="input" accept="image/*" onChange={this.onSelectFile} />
          </label>
          <Modal show={this.state.show} onHide={this.handleClose} >
            <Modal.Header >
              <Modal.Title>Crop the image</Modal.Title>
            </Modal.Header>
            <Modal.Body >
              {src && (
                <ReactCrop
                  src={src}
                  crop={crop}
                  ruleOfThirds
                  circularCrop={this.props.circle}
                  onImageLoaded={this.onImageLoaded}
                  onComplete={this.onCropComplete}
                  onChange={this.onCropChange}
                  className="w-100"
                />
              )}
            </Modal.Body>
            <Modal.Footer className="a-modal-buttons pt-3">
              <Button appearance="default" className="a-modal-button" onClick={() => { this.setState({ show: false }) }} as="span">الغاء</Button>
              <Button appearance="primary" className="a-modal-button" as="span" onClick={this.handleClose}>قص</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}

