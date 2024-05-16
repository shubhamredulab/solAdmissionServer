import { exec } from 'child_process';
import sharp from 'sharp';
import * as fs from 'fs';

/*
Author: Moin.
Description: this function use Ghostscript  for uploaded pdf compress the size
*/

export const compressPDF = async (inputPath: string, outputPath: string) => {
    return new Promise<void>((resolve, reject) => {
      // Full path to Ghostscript executable
      const gsPath = process.env.GhostscriptPath as string; // Update this path
  
      // Ghostscript command for compressing PDF
      const command = `"${gsPath}" -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputPath} ${inputPath}`;
  
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error compressing PDF: ${stderr}`);
          reject(error);
        } else {
          console.log('PDF compressed successfully:', stdout);
          resolve();
        }
      });
    });
  };


/*
Author: Moin.
Description: this function use sharp  for uploaded image compress the size
*/
export const compressAndMoveFile = async (inputPath: string, outputPath: string) => {
    try {
      const image = sharp(inputPath);
      await image.webp({ quality: 80 }).toFile(outputPath);
      fs.unlinkSync(inputPath);
    } catch (error) {
      console.error("Error compressing and moving file:", error);
      throw error;
    }
  };