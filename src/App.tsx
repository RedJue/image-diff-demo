import React, { useState } from "react";
import "./App.css";

function App() {
  const [imageOriginal, setImageOriginal] = useState("");
  const [imageCompare, setImageCompare] = useState("");
  const [imageDiff, setImageDiff] = useState("");
  const [type, setType] = useState<"original" | "compare">("original");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const diffImage = () => {
    const canvas = document.createElement("canvas");
    const canvas2 = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const ctx2 = canvas2.getContext("2d");
    const deviation = 10;
    let pixels: Uint8ClampedArray;
    const image1 = new Image();
    const image2 = new Image();
    image1.src = imageOriginal;
    image2.src = imageCompare;

    image1.onload = () => {
      if (ctx) {
        canvas.width = image1.width;
        canvas.height = image1.height;
        ctx.drawImage(image1, 0, 0);
        const imageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        ).data;
        pixels = imageData;
      }
    };
    image2.onload = () => {
      if (ctx2) {
        canvas2.width = image2.width;
        canvas2.height = image2.height;
        ctx2.drawImage(image2, 0, 0);
        const imageData = ctx2.getImageData(
          0,
          0,
          canvas2.width,
          canvas2.height
        );
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          if (
            Math.abs(pixels[i] - data[i]) >= deviation &&
            Math.abs(pixels[i + 1] - data[i + 1]) >= deviation &&
            Math.abs(pixels[i + 2] - data[i + 2]) >= deviation
          ) {
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = 255;
          }
        }
        ctx2.putImageData(imageData, 0, 0);
        setImageDiff(canvas2.toDataURL("image/png"));
      }
    };
  };

  const handleUpload = () => {
    const inputNode = inputRef.current;
    if (inputNode) {
      inputNode.click();
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        const result = reader.result?.toString() || "";
        switch (type) {
          case "compare":
            setImageCompare(result);
            break;
          case "original":
          default:
            setImageOriginal(result);
            break;
        }
      };
    }
  };

  return (
    <div className="image-diff">
      <h1>Image diff demo</h1>
      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.gif"
        style={{ display: "none" }}
        onChange={handleChange}
      />
      <div className="image-container">
        <div
          className="image-box"
          onClick={() => {
            handleUpload();
            setType("original");
          }}
        >
          {imageOriginal ? (
            <div className="image-source">
              <img src={imageOriginal} alt="" />
            </div>
          ) : (
            <span>Uploading original image here</span>
          )}
        </div>
        <div
          className="image-box"
          onClick={() => {
            handleUpload();
            setType("compare");
          }}
        >
          {imageCompare ? (
            <div className="image-source">
              <img src={imageCompare} alt="" />
            </div>
          ) : (
            <span> Uploading compare image here</span>
          )}
        </div>
      </div>
      <br />
      <button onClick={diffImage}>diff</button>
      <h2>Result</h2>
      <div className="image-result image-box">
        {imageDiff ? (
          <div className="image-source">
            <img src={imageDiff} alt="" />
          </div>
        ) : (
          <span> Diff image</span>
        )}
      </div>
    </div>
  );
}

export default App;
