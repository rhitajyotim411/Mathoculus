# Mathoculus

**Mathoculus** is a tool designed to calculate mathematical expressions from images. By recognizing the content in a picture, it processes and evaluates the expression.

## Features

- Image recognition of handwritten or printed mathematical expressions
- Calculates results from the detected expressions
- User-friendly web interface

## Key Algorithms and Models

1. **Image Processing**: Created an algorithm using OpenCV to extract digits and symbols from images sequentially.
2. **Model Training**: Utilized the TensorFlow framework and Keras library to train a CNN model on a dataset of handwritten digits and symbols, achieving an accuracy of 99.64%.
3. **Model Deployment**: Converted the TensorFlow model to TensorFlow.js for use in the web application.

## Hosted Website

Try out **Mathoculus** live [here](https://mathoculus.onrender.com/).
