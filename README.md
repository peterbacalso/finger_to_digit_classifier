# Hand Position to Digit Classifier using Transfer Learning with Tensorflow

## Motivation

Neural Networks are amazing. They have lead to innovations in areas such as speech recognition, natural language processing, forecasting, and computer vision. The fact that nueral nets have high model complexity and are able to learn intricate patterns coupled with the advent of big data has lead to very powerful applications. A few examples include synthesizing sound for a silent video, smart voice assistants that you can converse with, and even letting cars drive themselves. In order for me to get a slice of this black magic pie, I decided to try out a little introductory project for myself and hence, this hand/finger position to number classifier was born.

## Introduction

The hand to digit classifier takes as input an image of your hand with 5 states, each representing the numbers 1-5, and outputs the actual numeric value.

![App Demo](https://media.giphy.com/media/lqND3IemQzBrnU8vdC/giphy.gif)

## Methodology

#### Open Source Library

To create the deep learning model, I used [Keras](https://keras.io) which is a high-level deep learning library that has been integrated into [Tensorflow](https://www.tensorflow.org/). The API comes with pretrained models and offers enough flexibility to make all sorts of neural networks.

For completeness, I deployed the model in a [mobile app](https://github.com/peterbacalso/HandToDigitClassifier/tree/master/HandToDigitApp) created with [React Native](https://facebook.github.io/react-native/docs/getting-started).

#### Apparatus

Model Training
* GTX 1070 - 8GB VRAM (Tensorflow GPU installed)
* 16GB system RAM
* 4-core Intel Core i5
* Windows 10 OS
* Anaconda Python with Jupyter Notebook

Data Collection
* Samsung Galaxy S9 (For taking pictures)
* Fatkun Batch Download Image Chrome Extension

#### Model Design

I tried two different pretrained models for this project, one is [Xception](https://arxiv.org/abs/1610.02357) (a variant of GoogLeNet) and the other is MobileNet.

#### Data

I initially collected 120 pictures per state of my own hand totalling 600 pictures. Although I used transfer learning which allows neural network training with little data, this is not enough data to create a model that generalizes well, plus it runs the risk of overfitting to my own hand. To counter this I batch downloaded images from google and on top of that, added 218 more images per state from a subest of the [sign language digits dataset](https://www.kaggle.com/ardamavi/sign-language-digits-dataset) with reconfigured labels. All in all I ended up with 562 pictures per state, totalling 2810 pictures.

#### Procedure

The dataset is loaded into memory using [Tensorflow's Data API](https://www.tensorflow.org/tutorials/load_data/images). This creates a dataset generator that lets you easily apply processing functions and data augmentation. 

The images were divided into a 80/20 train/test split, scaled to 299x299, and standardized as per each models's `preprocess_input` function. The training split was augmented using horizontal and vertical flips, 40 degree rotations, and brightness fluctuations.

For both Xception and Mobilenet, majority of the bottom layers were frozen but a portion of the top layers were left trainable. In order to prevent overfitting, a number of regularization hyperparameters were applied. Namely dropout, L1, and L2 were added to the ouput layer, a small batch size of 10 was passed per iteration and finally since the dataset is small, cross-validation was implemented using random seed over 5 folds.

See [ipynb](ipynb) for more implementation details.

## Results

**MobileNet**
* 93.8% Top-1 Accuracy

* Precision and Recall

	Label | Recall | Precision
	--- | --- | ---
	five | 0.9298 | 0.9725
	four | 0.8947 | 0.9358
	three | 0.9828 | 0.8636
	two | 0.9027 | 0.9714
	one | 0.9823 | 0.9652

* Confusion Matrix

	*Note that labels are in alphabetical order*

	<img src="https://github.com/peterbacalso/HandToDigitClassifier/blob/master/assets/confusion_matrix_mobilenet.png" width="600" height="600" />

**Xception**
* 95% Top-1 Accuracy

* Precision and Recall

	Label | Recall | Precision
	--- | --- | ---
	five | 0.9298 | 0.9725
	four | 0.8947 | 0.9358
	three | 0.9569 | 0.9250
	two | 0.9735 | 0.9402
	one | 1.0000 | 0.9826

* Confusion Matrix

	*Note that labels are in alphabetical order*

	<img src="https://github.com/peterbacalso/HandToDigitClassifier/blob/master/assets/confusion_matrix_mobilenet.png" width="600" height="600" />

* Validation Loss and Validation Accuracy For Best Model

	![](https://github.com/peterbacalso/HandToDigitClassifier/blob/master/assets/acc_loss.png)

* All Models in 5-Fold Validation Loss and Validation Accuracy

	![](https://github.com/peterbacalso/HandToDigitClassifier/blob/master/assets/all_folds_acc_loss.png)

## Analysis

When it comes to accuracy on the test data Xception performs only marginaly higher than MobileNet. However when testing in real scenarios, it seems that Xception generalizes better as it is more invariant to changes in background and lighting.

## Conclusion

TODO: add next steps, how to improve model, etc.