using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BuildingDataChartApp.Models;
using System.Globalization;

namespace BuildingDataApp.Controllers
{
    public class HomeController : Controller
    {
        #region

        BuildingDataEntities bldb = new BuildingDataEntities();

        #endregion
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult DropdownEntries()
        {
            CultureInfo provider = CultureInfo.InvariantCulture;
            List<Building> buildings = bldb.Buildings.ToList();
            List<BuildingDataChartApp.Models.Object> objects = bldb.Objects.ToList();
            List<DataField> datafields = bldb.DataFields.ToList();
            List<decimal> values = bldb.Readings.Select(r => r.Value).ToList();
            List<string> timestamps = bldb.Readings.Select(r => r.Timestamp.ToString()).ToList();

            for (int i = 0; i < timestamps.Count; i++)
            {
                timestamps[i] = DateTime.Parse(timestamps[i], null,
                                              DateTimeStyles.RoundtripKind).ToString();
            }

            DataViewModel data = new DataViewModel
            {
                BuildingList = buildings,
                ObjectList = objects,
                DataFieldList = datafields,
                ValueList = values,
                TimeStampList = timestamps
            };

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Search(Search data)
        {
            List<decimal> values = bldb.Readings.Where(r => ((r.BuildingId != 0 && r.BuildingId == data.BuildingId) ||
                                                        (r.ObjectId != 0 && r.ObjectId == data.ObjectId) ||
                                                        (r.DataFieldId != 0 && r.DataFieldId == data.DatafieldId))
                                                        && (r.Timestamp >= data.StartDate && r.Timestamp <= data.EndDate)
                                                        ).Select(r => r.Value).ToList();

            List<string> timestamps = bldb.Readings.Where(r => ((r.BuildingId != 0 && r.BuildingId == data.BuildingId) ||
                                                        (r.ObjectId != 0 && r.ObjectId == data.ObjectId) ||
                                                        (r.DataFieldId != 0 && r.DataFieldId == data.DatafieldId))
                                                        && (r.Timestamp >= data.StartDate && r.Timestamp <= data.EndDate)
                                                        ).Select(r => r.Timestamp.ToString()).ToList();

            for (int i = 0; i < timestamps.Count; i++)
            {
                timestamps[i] = DateTime.Parse(timestamps[i], null,
                                              DateTimeStyles.RoundtripKind).ToString();
            }

            DataViewModel return_data = new DataViewModel
            {
                BuildingList = null,
                ObjectList = null,
                DataFieldList = null,
                ValueList = values,
                TimeStampList = timestamps
            };
            return Json(return_data, JsonRequestBehavior.AllowGet);
        }
    }
}