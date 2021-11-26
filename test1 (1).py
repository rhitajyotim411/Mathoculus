#!/usr/bin/env python
# coding: utf-8

# In[2]:


import numpy as np
import matplotlib.pyplot as plt
import os
import cv2


# In[4]:


datadir="C:/Users/Ankita Samaddar/Desktop/SEM 5/project/dataset"
dataset=["0","1","2","3","4","5","6","7","8","9"]
training_data=[]

#to check the first element of the dataset
for category in dataset:
    path=os.path.join(datadir,category) #path to specified folder
    for img in os.listdir(path):
        img_array=cv2.imread(os.path.join(path,img),cv2.IMREAD_GRAYSCALE)
        plt.imshow(img_array,cmap="gray")
        plt.show()
        break
    break
        


# In[5]:


print(img_array.shape)


# In[6]:


new_array=cv2.resize(img_array,(28,28)) #resizing the img_array to 28X28
plt.imshow(new_array, cmap="gray")
plt.show()


# In[7]:


# datadir="C:/Users/Ankita Samaddar/Desktop/SEM 5/project/dataset"
# dataset=['0','1','2','3','4','5','6','7','8','9']
# training_data=[]

def create_training_data():
    for category in dataset:
        path=os.path.join(datadir,category) #path to specified folder
        class_num=dataset.index(category)  #adding label
        for img in os.listdir(path):
            img_array=cv2.imread(os.path.join(path,img),cv2.IMREAD_GRAYSCALE) #reading each image in the dataset
            new_array=cv2.resize(img_array,(64,64))
            training_data.append([new_array,class_num]) #storing the image in the dataset with class_num as a label

create_training_data()


# In[8]:


print(len(training_data))


# In[9]:


import random

random.shuffle(training_data) #suffleing the dataset so that the model is not biased

x=[] #list to store features
y=[] #list to store labels

for features, label in training_data:
    x.append(features)
    y.append(label)
x=np.array(x).reshape(-1,64,64,1) #-1 is for dynamically calculating the dimension, 28X28 size , 1 is for gray code
y=np.array(y)


# In[31]:


# from sklearn.model_selection import train_test_split

# x_train, y_train, x_test, y_test=train_test_split(x,y,random_state=0)
# print(x_train.shape,y_train.shape)
# print(x_test.shape)


# In[11]:


input_shape=(64,64,1)


# In[12]:


x = x.astype('float32')
x /= 255
print('x_train shape:', x.shape)


# In[13]:


import keras
from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation, Conv2D, Flatten, MaxPooling2D

batch_size = 32
num_classes = 10
epochs = 10

model=Sequential()
model.add(Conv2D(32, kernel_size=3, activation="relu",input_shape=input_shape)) #filters=32, that is we want 32 features maps we want to create as output , kernel_size=3 means kernel will connect each neuron in the output to nine neurons in the input 
model.add(Conv2D(64, (3,3), activation="relu")) #filters=64 kernel_size=3
model.add(MaxPooling2D(pool_size=(2,2))) #the MaxPooling function uses a maximum function instead of a kernel with a pool_size parameter (similer to kernel_size). MaxPooling takes a patch of activations in the original feature map and replaces them with the maximum activation in the patch. 
model.add(Dropout(0.25)) # dropout randomly sets input units to 0 with a frequency of here 0.25 at each step during the training time, which helps prevent overfitting. Inputs not set to 0 are scaled upto 1/(1-0.25) such that the sum over all the inputs is unchanged.
model.add(Flatten()) #Flattens the input. Does not affect the batch size. Flattening adds an extra channels dimension and output shape is (batch,1).
model.add(Dense(256, activation='relu')) 
model.add(Dropout(0.5))
model.add(Dense(num_classes, activation='softmax'))

model.compile(loss="sparse_categorical_crossentropy",
              optimizer="adam",
              metrics=['accuracy'])
model.fit(x, y, batch_size=batch_size,epochs=epochs,verbose=1,validation_split=0.1)
print("The model has successfully trained")


# In[14]:


plt.imshow(x[0], cmap=plt.cm.binary)
plt.show()


# In[15]:


prediction=model.predict([x])
print(np.argmax(prediction[0]))


# In[16]:


print(np.argmax(prediction[100]))
plt.imshow(x[100])
plt.show()


# In[21]:





# In[ ]:





# In[29]:


new_path="C:\\Users\\Ankita Samaddar\\Documents\\GitHub\\picture-calculator\\images\\ROI_1.png"
w=cv2.imread(new_path)
z=cv2.resize(w,(64,64))
plt.imshow(z,cmap='gray')


# In[34]:


z=np.array(z).reshape(-1,64,64,1)
print('z shape:', z.shape)


# In[40]:


prediction=model.predict([z])
#print(np.argmax(prediction))
#print(prediction)

