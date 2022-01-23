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

    img = cv2.resize(pd, (imgSz, imgSz), interpolation=cv2.INTER_AREA) # 64,64

    # Removal of noise
    parts = cv2.findContours(img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[0]
    area = [cv2.contourArea(p) for p in  parts]

    for i in range(len(parts)):
        if i==area.index(max(area)):
            continue
        x,y,w,h = cv2.boundingRect(parts[i])
        img[y:y+h, x:x+w]=0

    return img
#End of Function

# Sort contours
def sort_cntr(points):
    c = len(points)
    cp = np.array(points, dtype=object)
    k = []
    avg_ht = np.sum(cp[::, 3])/len(points)
    lfx = cp[np.argsort(cp[::, 0])] # sorted according to x
    tpy = cp[np.argsort(cp[::, 1])] # sorted accordxing to y
    while c>0:
        j=0
        while j<len(tpy)-1:
            if not (tpy[j,3] < avg_ht and abs(tpy[j,1] - tpy[j+1,1]) < avg_ht):
                break
            j+=1

        i=0
        while i<len(lfx)-1:
            if lfx[i,1] < (tpy[j,1] + tpy[j,3]*0.9):
                break
            i+=1
        k.append(tuple(lfx[i]))
        if i >= 0:
            d = list(np.all(lfx[i] == tpy, axis = 1))
            x = d.index(True)
            tpy = np.delete(tpy, x, axis = 0)
        lfx = np.delete(lfx, i, axis = 0)
        c-=1
    return k
#End of Function




#Image processing
try:
    imarr = cv2.imread("./images/image.png", 0)
    imarr = cv2.GaussianBlur(imarr, (7, 7), 0)  #removes noise for smooth thresholding
    imarr = cv2.adaptiveThreshold(imarr, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 21, 4)
    imarr = cv2.threshold(imarr, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
    cons = cv2.findContours(imarr, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[0]
    cons = sort_cntr( [cv2.boundingRect(c) for c in  cons] ) # Sending bounding rect list
    ROI_number = 0
    for c in cons:
        area = c[2] * c[3]  # Width * Height
        if area > 100:
            x,y,w,h = c
            ROI = imarr[y:y+h, x:x+w]
            res = f'./images/ROI_{ROI_number}.png'
            sv = pad(ROI)
            cv2.imwrite(res, sv)
            print(sv.flatten())
            ROI_number += 1
except:
    print("An error occured",end=" ")
finally:
    print("code ran...")
#end

