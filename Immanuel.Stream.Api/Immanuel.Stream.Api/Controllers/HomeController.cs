using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Immanuel.Stream.Api.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult AudFull()
        {
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Preview(Models.HModel model)
        {
            ViewBag.Html = model;
            return View();
        }
    }
}