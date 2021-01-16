using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BuildingDataChartApp.Models
{
    public class Search
    {
        public int BuildingId { get; set; }
        public int ObjectId { get; set; }
        public int DatafieldId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}