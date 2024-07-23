import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { UsersService } from '../../../services/users.service';
import { FilesService } from '../../../services/files.service';
import { File } from '../../../models/file_model';

@Component({
  selector: 'app-add-file-form',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './add-file-form.component.html',
  styleUrl: './add-file-form.component.css',
})
export class AddFileFormComponent {
  tempFile?: File;
  constructor(
    private userService: UsersService,
    private fileService: FilesService
  ) {}

  createFile(fileName: string) {
    this.fileService.createFile(this.tempFile!).subscribe({
      next: (file) => {
        if (file.serverFileId) {
          console.log(this.userService.currentUser.userId);
          this.userService
            .addToPersonalFileList(
              file.serverFileId,
              this.userService.currentUser.userId
            )
            .subscribe({
              next: () => {
                this.userService.currentUser.serverFileIds.push(
                  file.serverFileId!
                );
                this.userService.updateUserInLocalStorage();
              },
              error: (err) => {
                alert('addToPersonalFileList() failed');
              },
            });
        }
      },
      error: (err) => {
        alert('createFile() failed');
      },
    });
  }
}
