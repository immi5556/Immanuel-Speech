using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Speech.AudioFormat;
using System.Speech.Recognition;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace Immanuel.Stream.Api.Controllers
{
    public class StreamController : ApiController
    {
        public async Task Put(int id, HttpRequestMessage request)
        {
            if (!Request.Content.IsMimeMultipartContent())
                throw new InvalidOperationException();

            var provider = new MultipartMemoryStreamProvider();
            await Request.Content.ReadAsMultipartAsync(provider);

            var file = provider.Contents.First();
            var filename = file.Headers.ContentDisposition.FileName.Trim('\"');
            var buffer = await file.ReadAsByteArrayAsync();
            var stream = new MemoryStream(buffer);

            using (var s = new StreamReader(stream))
            {
                //                saveFile.Execute(id, s);
            }
        }

        static SpeechRecognitionEngine GetRecognizer()
        {
            if (recognizer == null)
            {
                recognizer = new SpeechRecognitionEngine(new System.Globalization.CultureInfo("en-US"));
                // Create and load a dictation grammar.
                recognizer.LoadGrammar(new DictationGrammar());
                // Add a handler for the speech recognized event.
                recognizer.SpeechRecognized +=
                  new EventHandler<SpeechRecognizedEventArgs>(recognizer_SpeechRecognized);
            }

            return recognizer;
        }

        static SpeechRecognitionEngine recognizer = null;

        [HttpPost]
        public string PostData()
        {
            System.Web.HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;
            string txt = "";
            if (hfc.Count < 1)
            {
                throw new ApplicationException("Empty File Bad Request");
            }
            GetRecognizer();
            //var wavformat = new SpeechAudioFormatInfo(44100, AudioBitsPerSample.Sixteen, AudioChannel.Mono));
            // Configure input to the speech recognizer.
            //SpeechAudioFormatInfo synthFormat = new SpeechAudioFormatInfo(EncodingFormat.Pcm, 88200, 16, 1, 16000, 2, null);
            recognizer.SetInputToAudioStream(hfc[0].InputStream, new SpeechAudioFormatInfo(44100, AudioBitsPerSample.Sixteen, AudioChannel.Mono));
            //recognizer.SetInputToAudioStream(hfc[0].InputStream, synthFormat);
            recognizer.RecognizeAsync(RecognizeMode.Single);
            //txt = recognizer.Recognize().Text;


            return txt;
        }

        string GetFile(string fpath, int seq)
        {
            string i = "_" + seq.ToString();
            string fpath1 = Path.Combine(Path.GetDirectoryName(fpath), Path.GetFileNameWithoutExtension(fpath) + i.ToString() + Path.GetExtension(fpath));
            if (!File.Exists(fpath1))
            {
                return fpath1;
            }
            else
            {
                return GetFile(fpath, ++seq);
            }
        }

        static void recognizer_SpeechRecognized(object sender, SpeechRecognizedEventArgs e)
        {
            Console.WriteLine("Recognized text: " + e.Result.Text);
        }

        public string UploadMultipart(byte[] file, string filename, string contentType, string url)
        {
            var webClient = new WebClient();
            string boundary = "------------------------" + DateTime.Now.Ticks.ToString("x");
            webClient.Headers.Add("Content-Type", "multipart/form-data; boundary=" + boundary);

            string formdataTemplate = "Content-Disposition: form-data; name=\"{0}\"\r\n\r\n{1}";
            var package = boundary;
            package = package + string.Format(formdataTemplate, "tofmt", "wav");
            package = package + "\r\n";
            package = package + boundary + "\r\n";
            var fileData = webClient.Encoding.GetString(file);
            package = package + string.Format("--{0}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{1}\"\r\nContent-Type: {2}\r\n\r\n{3}\r\n--{0}--\r\n", boundary, filename, contentType, fileData);

            var nfile = webClient.Encoding.GetBytes(package);

            byte[] resp = webClient.UploadData(url, "POST", nfile);
            string path = System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/Temp");
            var fpp = GetFile(Path.Combine(path, "Sample.wav"), 0);
            System.Threading.Thread.Sleep(2000);
            File.WriteAllBytes(fpp, resp);
            return fpp;
        }

        [HttpPost]
        public string PostData1()
        {
            string rett = "sucess";
            System.Web.HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;
            MemoryStream ms = new MemoryStream();
            hfc[0].InputStream.CopyTo(ms);
            var pth = UploadMultipart(ms.ToArray(), "recording.webm", hfc[0].ContentType, "http://video-converter.immanuel.co/api/File/Converter");
            //var tt = ProcessExecute(pth);
            System.Threading.Thread.Sleep(5000);
            rett = File.ReadAllText(Path.ChangeExtension(pth, "txt"));
            //rett = rett + tt;
            return rett;
        }

        [HttpPost]
        public string PostData2()
        {
            string rett = "sucess";
            System.Web.HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;
            MemoryStream ms = new MemoryStream();
            hfc[0].InputStream.CopyTo(ms);
            string path = System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/Temp");
            var fpp = GetFile(Path.Combine(path, "Sample.wav"), 0);
            hfc[0].SaveAs(fpp);
            System.Threading.Thread.Sleep(5000);
            rett = File.ReadAllText(Path.ChangeExtension(fpp, "txt"));
            //rett = rett + tt;
            return rett;
        }

        static string ProcessExecute(string args)
        {
            string path = System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data");
            path = Path.Combine(path, "Exe", "Speech.Transform.exe");
            string r = "";
            using (Process proc = new Process())
            {
                proc.StartInfo.FileName = path;
                proc.StartInfo.Arguments = "\"" + args + "\"";
                //proc.StartInfo.CreateNoWindow = true;
                //proc.StartInfo.WindowStyle = ProcessWindowStyle.Hidden;
                ////Thread.Sleep(500);
                //proc.Start();
                //proc.WaitForExit();
                //StringBuilder q = new StringBuilder();
                //while (!proc.HasExited)
                //{
                //    q.Append(proc.StandardOutput.ReadToEnd());
                //}
                //r = q.ToString();
                //proc.Close();
                //return r;
                //proc.StartInfo.Domain = ".";
                proc.StartInfo.UserName = "Administrator";
                string password = "Streamlined$123";
                System.Security.SecureString ssPwd = new System.Security.SecureString();
                for (int x = 0; x < password.Length; x++)
                {
                    ssPwd.AppendChar(password[x]);
                }
                password = "";
                proc.StartInfo.Password = ssPwd;
                proc.StartInfo.RedirectStandardOutput = true;
                proc.StartInfo.UseShellExecute = false;
                proc.Start();
                string stdout = proc.StandardOutput.ReadToEnd();
                proc.WaitForExit();

                return path + " --  " + stdout + " --- " + args;
            }
        }
    }
}