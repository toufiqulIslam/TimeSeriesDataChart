using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BuildingDataChartApp.Models
{
    public class DataViewModel
    {
        public List<Building> BuildingList { get; set; }
        public List<Object> ObjectList { get; set; }
        public List<DataField> DataFieldList { get; set; }
        public List<decimal> ValueList { get; set; }
        public List<string> TimeStampList { get; set; }
    }
}