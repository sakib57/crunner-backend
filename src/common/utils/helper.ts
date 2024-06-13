import { Transform } from 'class-transformer';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * update for subDocument Array
 * if newItems is a dynamic type then it would occure some problem
 * @param {schema} currentDocs - The current document that needs to update.
 * @param {schema} newItems - New data transfer object that needs to merge with current document.
 * @returns {schema} the updated document.
 */
export function subDocUpdateWithArray(currentDocs, newItems) {
  const replacedDocs = [];
  let isReplaced = false;
  newItems.map((item) => {
    if (typeof item === 'object') {
      if (item.hasOwnProperty('_id')) {
        if (item.hasOwnProperty('isDeleted') && item.isDeleted) {
          currentDocs = currentDocs.filter((doc) => doc._id != item['_id']);
        } else {
          currentDocs = currentDocs.map((doc) =>
            item['_id'] == doc._id ? item : doc,
          );
        }
      } else {
        currentDocs.push(item);
      }
    } else if (typeof item == 'string' || typeof item == 'number') {
      replacedDocs.push(item);
      isReplaced = true;
    } else {
      currentDocs.push(item);
    }
  });

  return isReplaced ? replacedDocs : currentDocs;
}

/**
 * update for subDocument object
 * @param {schema} currentDoc - The current document that needs to update.
 * @param {schema} newItem - New data transfer object that needs to merge with current document.
 * @returns {schema} the updated document.
 */
export function subDocUpdateWithObj(currentDoc, newItem) {
  if (newItem && newItem.hasOwnProperty('isDeleted') && newItem.isDeleted) {
    currentDoc = {};
  } else {
    const keys = Object.keys(newItem);
    keys.map((key) => {
      if (
        !(newItem[key] == null || newItem[key] == undefined) &&
        typeof newItem[key] === 'object' &&
        !Array.isArray(newItem[key])
      ) {
        const currentSubDoc =
          (currentDoc[key] && currentDoc[key]._doc) || currentDoc[key] || {};
        newItem[key] = subDocUpdateWithObj(currentSubDoc, newItem[key]);
        currentDoc[key] = newItem[key];
      } else if (Array.isArray(newItem[key]) && newItem[key].length > 0) {
        currentDoc[key] = subDocUpdateWithArray(currentDoc[key], newItem[key]);
      } else {
        currentDoc[key] = newItem[key];
      }
    });
  }
  return currentDoc;
}

/**
 *
 * @param token
 * @param {string} password
 * @returns
 */
export async function encodeToken(token, password) {
  try {
    const iv = randomBytes(16);
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);
    const encryptedToken = Buffer.concat([
      cipher.update(JSON.stringify(token)),
      cipher.final(),
    ]);
    return encryptedToken.toString('hex') + 'ILN' + iv.toString('hex');
  } catch (err) {
    throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
  }
}

/**
 *
 * @param {string} token
 * @param {string} password
 * @returns
 */
export async function decodeToken(token: string, password: string) {
  try {
    const tokenSplit = token.split('ILN');
    const iv = Buffer.from(tokenSplit[1], 'hex');
    const tokenBuff = Buffer.from(tokenSplit[0], 'hex');
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    const decrypted = Buffer.concat([
      decipher.update(tokenBuff),
      decipher.final(),
    ]);
    return JSON.parse(decrypted.toString());
  } catch (err) {
    throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
  }
}

/**
 *
 * @param {string} email
 */
export function isEmail(email: string) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function ToBoolean() {
  return Transform((v) => ['1', 1, 'true', true].includes(v.value));
}

/**
 * @param {string} prefix
 * @param {number} id
 */
export function generateId(prefix: string, id: number) {
  const numberLength = (n) => String(Math.abs(n)).length;
  const idLength = numberLength(id);
  return `${prefix}${'0'.repeat(8 - idLength)}${id}`;
}

/**
 * prepare filter query
 * @Param query
 * @returns {Object}
 */
export function createSearchQuery(query) {
  try {
    let searchQuery: any = {
      isActive: true,
    };

    if (query.hasOwnProperty('noCondition') && query.noCondition === true) {
      delete searchQuery.isActive;
      delete searchQuery.isDeleted;
    }

    if (query.hasOwnProperty('filter') && query.filter) {
      searchQuery = {
        ...searchQuery,
        ...JSON.parse(query.filter),
      };
    }

    return searchQuery;
  } catch (err) {
    throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
  }
}

export function convertEngDigits(date: string) {
  const numbers = {
    '০': 0,
    '১': 1,
    '২': 2,
    '৩': 3,
    '৪': 4,
    '৫': 5,
    '৬': 6,
    '৭': 7,
    '৮': 8,
    '৯': 9,
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
  };

  const output = [];
  for (let i = 0; i < date.length; ++i) {
    if (numbers.hasOwnProperty(date[i])) {
      output.push(numbers[date[i]]);
    } else {
      output.push(date[i]);
    }
  }
  return output.join('');
}
