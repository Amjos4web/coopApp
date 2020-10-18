<template>
  <div>
    <div id="page-wrapper">
      <div class="header">
        <h3 class="page-header">
          Calendar
        </h3>
        <ol class="breadcrumb">
          <li>
            <a>
							<router-link to="/dashboard">
								Dashboard
							</router-link>
						</a>
          </li>
          <li><a href="#" class="active">Calendar</a></li>
        </ol>
      </div>
      <div class="page-inner">
        
        <form action="" method="get">
          <div class="container">
            <div class="alert alert-info">
              <p>This is where meeting calendar is being set for each society and year</p>
            </div>
            <div class="filter-result">
              <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Select Society</label>
                      <select name="society" id="society" class="form-control">
                        <option value="">Select Society</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Select Year</label>
                      <select name="year" id="year" class="form-control">
                        <option value="">Select Year</option>
                      </select>
                    </div>
                  </div>
              </div>
            </div>
            <div class="text-center mt-20">
              <input type="submit" value="Proceed" class="btn-general" data-target="#calendarModal" data-toggle="modal">
            </div>
          </div>
        </form>
      </div>
    

    <div class="modal fade" id="calendarModal" role="dialog" style="border-radius: 5px;">
      <div class="modal-dialog modal-lg">
        <!-- Modal content no 1-->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Meeting Calendar for Odokoto Ifeoluwa C.I.C.S for the year 2020</h4>
          </div>
          <div class="modal-body">
            
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-default pull-right cancel ml-10" data-dismiss="modal" id="cancel">Ok</button>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Calendar'
}
</script>