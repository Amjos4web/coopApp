<template>
  <div class="mt-20">
    <div class="container">
      <div class="row">
        <h4><small>All <strong>{{ societyName }}</strong> Members</small></h4>
        <div class="table-responsive">
          <table class="styled-table" ref="exportTable">
            <thead>
              <tr>
                <th>#</th>
                <th @click="sortTable('member_name')">
                  Name
                  <span v-if="sortKey === 'member_name'">
                    <span v-if="sortOrder === 'asc'">▲</span>
                    <span v-else>▼</span>
                  </span>
                </th>
                <th>Gender</th>
                <th>Phone No</th>
                <th @click="sortTable('member_asset')">
                  Total Assets
                  <span v-if="sortKey === 'member_asset'">
                    <span v-if="sortOrder === 'asc'">▲</span>
                    <span v-else>▼</span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(member, index) in sortedSocietyMembers" :key="member.id">
                <td>{{ (index) + 1 }}</td>
                <td>{{ member ? member.member_name : "Unknown" }}</td>
                <td>{{ member ? member.member_gender : 'Not available' }}</td>
                <td>{{ member ? member.member_phone : 'Not available' }}</td>
                <td>&#x20A6;{{ Number(member.member_asset).toLocaleString() }}</td>
              </tr>
              <tr v-if="sortedSocietyMembers.length > 0">
                <td colspan="5" class="text-center"><h4>Total: &#x20A6;{{ Number(total).toLocaleString() }}</h4></td>
              </tr>
            </tbody>
          </table>
          <div class="text-center" v-if="sortedSocietyMembers.length > 0">
            <button @click="generatePDF" class="btn btn-warning">Export to PDF</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsPDF from "jspdf";
import "jspdf-autotable";

const ID = String | Number

export default {
  name: 'society-members-list',
  props: {
    societyMembers: Array,
    societyName: String,
    total: Number,
    currentDate: String
  },
  data(){
    return {
      sortKey: 'member_name', // Column being sorted
      sortOrder: 'asc', // Sorting order, 'asc' or 'desc'
    }
  },
  methods: {
    generatePDF() {
      // Create a new jsPDF instance.
      const doc = new jsPDF();

      const title = `${this.$props.societyName} Members Assets`;
      const current_date = `Generated on ${this.$props.currentDate}`

      //Get page width
      const pageWidth = doc.internal.pageSize.getWidth();

      //Get the text width
      const textWidth = doc.getTextWidth(title);

      //Calaculate x position to center the text
      const titleX = (pageWidth - textWidth) / 2;
      
      const current_date_width = doc.getTextWidth(current_date);
      const current_date_X = (pageWidth - current_date_width) / 2;

      doc.text(title, titleX, 15);
      doc.text(current_date, current_date_X, 10)

      // Get the table rows and headers
      const columns = ["#", "Name", "Phone No", "Gender", "Total Asset"];
      
      const rows = this.sortedSocietyMembers.map((m, index) => [
        index + 1,
        m.member_name,
        m.member_phone || 'Not available',
        m.member_gender || 'Not available',
        `N${Number(m.member_asset).toLocaleString()}`
      ]);

      // Add autoTable
      doc.autoTable({
        head: [columns],   // Table header
        body: rows,        // Table rows
        theme: 'grid', // 'striped', 'plain', 'grid'
        headStyles: { fillColor: [0, 0, 0] },
        footStyles: { fillColor: [0, 0, 0] },
        margin: { top: 5 },
        startY: 20, // Starting Y position
      });
      
      const finalY = doc.lastAutoTable.finalY;
      const totalText = `Total: N${Number(this.$props.total).toLocaleString()}`;

      doc.text(totalText, 14, finalY + 10);
      // Save the PDF with a filename.
      doc.save(`${this.$props.societyName}_member_assets.pdf`);
    },

    sortTable(key) {
      if (this.sortKey === key) {
        // Toggle between ascending and descending order
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        // If sorting a new column, default to ascending
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
    }
  },
  computed: {
    sortedSocietyMembers() {
      return this.societyMembers.slice().sort((a, b) => {
        let modifier = this.sortOrder === 'asc' ? 1 : -1;
        if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
        if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
        return 0;
      });
    }
  }
}
</script>
<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

table, th, td {
  border: 1px solid rgb(237, 234, 234);
  padding: 8px;
  text-align: left;
}

th {
  cursor: pointer;
}

th span {
  margin-left: 5px;
}
</style>