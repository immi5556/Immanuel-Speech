using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Immanuel.Stream.Api.Models
{
    public class HModel
    {
        [AllowHtml]
        public string HString { get; set; }

    }
}