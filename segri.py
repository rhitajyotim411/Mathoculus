import cv2
import numpy as np
import math

imgSz = 64  # img size

# padding function
def pad(img):
    h, w = img.shape
    re_h, re_w = h, w
    x = 7  # pad to be added
    re_sz = imgSz - 2*x
    mx = max(h, w)
    kernel = np.ones((3, 3), np.uint8)

    if h > w:
        re_h = re_sz
        re_w = round(re_sz * w/h)
        re_w = re_w if re_w % 2 == 0 else re_w - 1
        h = x
        w = int((re_sz - re_w)/2) + x
    else:
        re_h = round(re_sz * h/w)
        re_h = re_h if re_h % 2 == 0 else re_h - 1
        re_w = re_sz
        h = int((re_sz - re_h)/2) + x
        w = x

    img = cv2.resize(img, (re_w, re_h), interpolation=cv2.INTER_AREA)

    pd = np.full((imgSz, imgSz), 0, dtype=np.uint8)
    pd[h: -h,  w: -w] = img

    if mx < re_sz:
        img = cv2.erode(pd, kernel, iterations=1)
    else:
        img = cv2.dilate(pd, kernel, iterations=1)

    # Removal of noise
    parts = cv2.findContours(img, cv2.RETR_EXTERNAL,
                             cv2.CHAIN_APPROX_SIMPLE)[0]
    area = [cv2.contourArea(p) for p in parts]

    for i in range(len(parts)):
        if i == area.index(max(area)):
            continue
        x, y, w, h = cv2.boundingRect(parts[i])
        img[y:y+h, x:x+w] = 0

    return img
# End of Function


# Sort contours
def sort_cntr(points):
    c = len(points)
    cp = np.array(points, dtype=object)
    k = []
    avg_ht = np.sum(cp[::, 3])/len(points)
    lfx = cp[np.argsort(cp[::, 0])]  # sorted according to x
    tpy = cp[np.argsort(cp[::, 1])]  # sorted accordxing to y
    while c > 0:
        j = 0
        while j < len(tpy)-1:
            if not (tpy[j, 3] < avg_ht and abs(tpy[j, 1] - tpy[j+1, 1]) < avg_ht):
                break
            j += 1

        i = 0
        while i < len(lfx)-1:
            if lfx[i, 1] < (tpy[j, 1] + tpy[j, 3]*0.9):
                break
            i += 1
        k.append(tuple(lfx[i]))
        if i >= 0:
            d = list(np.all(lfx[i] == tpy, axis=1))
            x = d.index(True)
            tpy = np.delete(tpy, x, axis=0)
        lfx = np.delete(lfx, i, axis=0)
        c -= 1
    return k
# End of Function


# Image processing
imarr = cv2.imread("./images/image.png", 0)
temp = cv2.imread("./images/image.png")
kernel = np.ones((2, 2), np.uint8)

# removes noise for smooth thresholding
imarr = cv2.GaussianBlur(imarr, (9, 9), 0)
imarr = cv2.adaptiveThreshold(
    imarr, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 21, 4)
imarr = cv2.dilate(imarr, kernel, iterations=1)  # dilates images
cons = cv2.findContours(imarr, cv2.RETR_EXTERNAL,
                        cv2.CHAIN_APPROX_SIMPLE)[0]

if len(cons)<1:    # Blank Canvas Exit
    print(f'{temp.shape[0]},{temp.shape[1]}')   # Canvas Size
    exit()

cons = sort_cntr([cv2.boundingRect(c)
                 for c in cons])  # Sending bounding rect list

scale = math.sqrt(temp.shape[0]**2 + temp.shape[1]**2) / 1000
thicc = round(5 * scale)

ROI_number = 0
for c in cons:
    area = c[2] * c[3]  # Width * Height
    if area > 100:
        x, y, w, h = c
        ROI = imarr[y:y+h, x:x+w]
        res = f'./images/ROI_{ROI_number}.png'
        sv = pad(ROI)
        cv2.imwrite(res, sv)
        print(sv.flatten())
        ROI_number += 1
        temp = cv2.rectangle(temp, (c[0], c[1]),
                             (c[0]+c[2], c[1]+c[3]), (57,70,242), thicc)

cv2.imwrite("./images/image.png", temp)
print(f'{temp.shape[0]},{temp.shape[1]}')   # Canvas Size
# end
