import cv2
import matplotlib.pyplot as plt
from imutils import contours
import numpy as np

#padding function
def pad(img):
    h,w = img.shape

    if h%2==1:
        img = np.vstack([img, 255 - np.zeros(w, int)])
        h += 1

    if w%2==1:
        img = np.column_stack([img, 255 - np.zeros(h, int)])
        w += 1

    sz = max(h,w)
    x=20 #pad to be added

    pd = 255 - np.zeros((sz+2*x, sz+2*x), int)

    h = int((sz-h) / 2) + x
    w = int((sz-w) / 2) + x

    pd[h : -h,  w : -w] = img

    return pd
#End of Function

imarr = cv2.imread("./images/image.png", 0)
imarr = imarr
#plt.imshow(imarr, cmap="gray")

imarr = cv2.threshold(imarr, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

cons = cv2.findContours(imarr, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[0]

cons, _ = contours.sort_contours(cons, method="left-to-right")

# plt.imshow(imarr, cmap="gray")

ROI_number = 0
for c in cons:
    area = cv2.contourArea(c)
    if area > 10:
        x,y,w,h = cv2.boundingRect(c)
        ROI = 255 - imarr[y:y+h, x:x+w]
        #ROI = cv2.resize(ROI, (64,64))
        res = f'./images/ROI_{ROI_number}.png'
        print(res)
        cv2.imwrite(res, pad(ROI))
        # cv2.rectangle(imarr, (x, y), (x + w, y + h), (255,0,0), 1)
        ROI_number += 1

# plt.imshow(imarr , cmap="gray")
#end
