using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Speech.Recognition;
using System.Text;
using System.Threading.Tasks;

namespace Speech.Transform
{
    class Program
    {
        static void Main(string[] args)
        {
            ConvertVid();
            Console.ReadKey();
        }
        static void PostData()
        {
            foreach (RecognizerInfo ri in SpeechRecognitionEngine.InstalledRecognizers())
            {
                Console.WriteLine(ri.Culture.Name);
            }
            FileSystemWatcher watcher = new FileSystemWatcher();
            watcher.Path = @"C:\Immi\Personal\MyProjects\streamapi\_deploy\App_Data\Temp";
            watcher.NotifyFilter = NotifyFilters.LastAccess | NotifyFilters.LastWrite
          | NotifyFilters.FileName | NotifyFilters.DirectoryName;
            // Only watch text files.
            watcher.Filter = "*.wav";
            watcher.Created += new FileSystemEventHandler(OnChanged);
            watcher.EnableRaisingEvents = true;
        }
        static void ConvertVid()
        {
            string ss = @"C:\Immi\Personal\MyProjects\ffmeg\Immanuel.Ffmpeg\Immanuel.Ffmpeg\App_Data\ffmpeg\sample.webm";
            string ext = "m4v";
            File.WriteAllBytes(@"C:\Immi\Personal\MyProjects\streamapi\Immanuel.Stream.Api\Speech.Transform\Data\sample_2." + ext, ConvertVideo(File.ReadAllBytes(ss), Path.GetFileName(ss), ext)); 
        }

        private static byte[] ConvertVideo(byte[] file, string filename, string toType)
        {
            HttpContent bytesContent = new ByteArrayContent(file);
            using (var client = new HttpClient())
            using (var formData = new MultipartFormDataContent())
            {
                formData.Add(new StringContent(toType), "tofmt");
                formData.Add(bytesContent, "file", filename);
                var response = client.PostAsync(@"http://video-converter.immanuel.co/api/File/Converter", formData).Result;
                if (!response.IsSuccessStatusCode)
                    return null;
                byte[] arr;
                using (MemoryStream ms = new MemoryStream())
                {
                    response.Content.ReadAsStreamAsync().Result.CopyTo(ms);
                    arr = ms.ToArray();
                }
                return arr;
            }
        }

        private static byte[] ConvertVideo2(byte[] file, string filename, string toType)
        {
            // Convert each of the three inputs into HttpContent objects
            //HttpContent stringContent = new StringContent(filename);
            // examples of converting both Stream and byte [] to HttpContent objects
            // representing input type file
            //HttpContent fileStreamContent = new StreamContent(fileStream);
            HttpContent bytesContent = new ByteArrayContent(file);

            // Submit the form using HttpClient and 
            // create form data as Multipart (enctype="multipart/form-data")

            using (var client = new HttpClient())
            using (var formData = new MultipartFormDataContent())
            {
                // Add the HttpContent objects to the form data

                // <input type="text" name="filename" />
                //formData.Add(stringContent, "filename", "filename");

                formData.Add(new StringContent(toType), "tofmt");

                // <input type="file" name="file1" />
                //formData.Add(fileStreamContent, "file1", "file1");
                // <input type="file" name="file2" />
                formData.Add(bytesContent, "file", filename);

                // Actually invoke the request to the server

                // equivalent to (action="{url}" method="post")
                var response = client.PostAsync(@"http://localhost:54339/api/File/Converter", formData).Result;

                // equivalent of pressing the submit button on the form
                if (!response.IsSuccessStatusCode)
                {
                    return null;
                }
                byte[] arr;
                using (MemoryStream ms = new MemoryStream())
                {
                    response.Content.ReadAsStreamAsync().Result.CopyTo(ms);
                    arr = ms.ToArray();
                }
                return arr;
            }
        }

        public static byte[] ConvertVideo1(byte[] file, string filename)
        {
            return ConvertVideo1(file, filename, "video/quicktime");
        }
        public static byte[] ConvertVideo1(byte[] file, string filename, string contentType)
        {
            var webClient = new WebClient();
            string boundary = "------------------------" + DateTime.Now.Ticks.ToString("x");
            webClient.Headers.Add("Content-Type", "multipart/form-data; boundary=" + boundary);

            string formdataTemplate = "Content-Disposition: form-data; name=\"{0}\"\r\n\r\n{1}";
            string package = boundary + "\r\n";
            package = package + string.Format(formdataTemplate, "tofmt", "wav");
            //package = package + "\r\n";
            package = package + boundary + "\r\n";
            var fileData = webClient.Encoding.GetString(file);
            package = package + string.Format("--{0}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{1}\"\r\nContent-Type: {2}\r\n\r\n{3}\r\n--{0}--\r\n", boundary, filename, contentType, fileData);

            var nfile = webClient.Encoding.GetBytes(package);

            //byte[] resp = webClient.UploadData(@"http://video-converter.immanuel.co/api/File/Converter", "POST", nfile);
            byte[] resp = webClient.UploadData(@"http://localhost:54339/api/File/Converter", "POST", nfile);
            return resp;
        }

        static object _lck = new object();
        private static void OnChanged(object source, FileSystemEventArgs e)
        {
            // Specify what is done when a file is changed, created, or deleted.
            Console.WriteLine("File: " + e.FullPath + " " + e.ChangeType);
            if (e.ChangeType != WatcherChangeTypes.Created)
                return;
            lock (_lck)
            {
                proc(e.FullPath);
            }
        }


        static void proc(string file)
        {
            //File.WriteAllText(Path.ChangeExtension(file, "log"), "Some test");
            string rett = "";

            using (SpeechRecognitionEngine sre = new SpeechRecognitionEngine())
            {
                Grammar gr = new DictationGrammar();
                sre.LoadGrammar(gr);
                while (true)
                {
                    try
                    {
                        var recText = sre.Recognize();
                        if (recText == null)
                        {
                            break;
                        }
                        rett = rett + recText.Text;
                        //sb.Append(recText.Text);
                    }
                    catch (Exception ex)
                    {
                        break;
                    }
                }
            }


            string ttfile = Path.ChangeExtension(file, "txt");
            File.WriteAllText(ttfile, rett);
            //sre.RecognizeAsyncStop();
            //sre.Dispose();
            Console.WriteLine(ttfile);
        }
    }
}
