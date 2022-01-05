import cv2
from imutils import contours
import numpy as np

# f = open("img.txt", "w")
# f.close()

#padding function
imgSz = 64
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

# def store(img):
#     f=open("img.txt", "a")
#     for i in img:
#         f.write(str(i)+",")
#     f.write("\n\n")
#     f.close()

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
        ROI = imarr[y:y+h, x:x+w]
        #ROI = cv2.resize(ROI, (64,64))
        res = f'./images/ROI_{ROI_number}.png'
        # print(res)
        sv = pad(ROI)
        cv2.imwrite(res, sv)
        # store(sv.flatten())
        print(sv.flatten())
        # cv2.rectangle(imarr, (x, y), (x + w, y + h), (255,0,0), 1)
        ROI_number += 1

# plt.imshow(imarr , cmap="gray")
#end
