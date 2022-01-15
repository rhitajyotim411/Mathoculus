import cv2
from imutils import contours
import numpy as np

imgSz = 64

#padding function
def pad(img):
    h,w = img.shape

    if h%2==1:
        img = np.vstack([img, np.zeros(w, dtype=np.uint8)])
        h += 1

    if w%2==1:
        img = np.column_stack([img, np.zeros(h, dtype=np.uint8)])
        w += 1

    sz = max(h,w)
    x=20 #pad to be added

    pd = np.full((sz+2*x, sz+2*x), 0, dtype=np.uint8)

    h = int((sz-h) / 2) + x
    w = int((sz-w) / 2) + x

    pd[h : -h,  w : -w] = img

    return cv2.resize(pd, (imgSz, imgSz), interpolation=cv2.INTER_AREA) # 64,64
#End of Function


#Image processing
try:
    imarr = cv2.imread("./images/image.png", 0)

    imarr = cv2.GaussianBlur(imarr, (7, 7), 0)  #removes noise for smooth thresholding

    imarr = cv2.adaptiveThreshold(imarr, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 21, 4)

    imarr = cv2.threshold(imarr, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

    cons = cv2.findContours(imarr, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[0]

    cons, _ = contours.sort_contours(cons, method="left-to-right")



    ROI_number = 0
    for c in cons:
        area = cv2.contourArea(c)
        if area > 100:
            x,y,w,h = cv2.boundingRect(c)
            ROI = imarr[y:y+h, x:x+w]
            res = f'./images/ROI_{ROI_number}.png'
            # print(res)
            sv = pad(ROI)
            cv2.imwrite(res, sv)
            # store(sv.flatten())
            print(sv.flatten())
            ROI_number += 1
except:
    print("An error occured",end=" ")
finally:
    print("code ran...")

#end
